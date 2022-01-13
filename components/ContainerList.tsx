import useSWR from "swr";
import ReactLoading from "react-loading";
import { Todo } from "types";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import update from "immutability-helper";
import { useDebounce } from "lib";
import { Types } from "mongoose";
import List from "./List";

const ContainerList = () => {
  const { data, mutate } = useSWR("/api/todo");
  const [list, setList] = useState("");
  const [filteredData, setFilteredData] = useState<Todo[]>([]);

  const debounce = useDebounce();

  const handleRowChange = useCallback(
    (updatedData: Todo[]) => {
      const data = updatedData.map((item) => {
        return {
          _id: new Types.ObjectId(),
          condition: item.condition,
          title: item.title,
        };
      });
      axios({
        method: "DELETE",
        url: "/api/edit",
      })
        .then(() => {
          axios({
            method: "POST",
            url: "/api/edit",
            data: {
              data,
            },
          })
            .then(() => {
              mutate();
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => console.log(err.message));
    },
    [mutate]
  );

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = filteredData[dragIndex];
      const updatedData = update(filteredData, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      setFilteredData(updatedData);
      debounce(() => {
        handleRowChange(updatedData);
      }, 3000);
    },
    [debounce, filteredData, handleRowChange]
  );

  useEffect(() => {
    data && setFilteredData(data.data);
  }, [data]);

  const handleCreateList = useCallback(() => {
    axios({
      method: "POST",
      url: "/api/todo",
      data: {
        title: list,
      },
    })
      .then(() => {
        mutate();
        setList("");
      })
      .catch((err) => console.log(err.message));
  }, [list, mutate]);

  const handleDeleteAll = useCallback(() => {
    axios({
      method: "DELETE",
      url: "/api/todo",
    })
      .then(() => {
        mutate();
      })
      .catch((err) => console.log(err.message));
  }, [mutate]);

  return (
    <div className="rounded overflow-hidden ">
      <div className="dark:bg-black bg-white  ">
        <input
          className=" px-4 w-full h-14 bg-transparent focus:outline-none  text-xl dark:text-white "
          value={list}
          placeholder="Add a list...."
          onChange={(e) => setList(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              list && handleCreateList();
            }
          }}
          type="text"
        />
      </div>

      <div>
        <div className={`${!data && "flex items-center justify-center"}`}>
          {data ? (
            (filteredData as Todo[]).map((item, index) => {
              return (
                <List
                  {...item}
                  key={item._id.toString()}
                  index={index}
                  moveCard={moveCard}
                />
              );
            })
          ) : (
            <ReactLoading type="spin" color="#000" height={20} width={20} />
          )}
        </div>
        <div className="flex items-center justify-between  sm:flex-row flex-col sm:mt-8">
          <p className="mt-4 sm:mt-0">
            {data ? data.data.length : "-"} items left
          </p>
          <div className="my-4 sm:my-0">
            <button
              className="mx-4 hover:text-blue-500 transition-colors"
              onClick={() => {
                setFilteredData(data.data);
              }}
            >
              All
            </button>
            <button
              className="mx-4 hover:text-blue-500 transition-colors"
              onClick={() => {
                setFilteredData(
                  (data.data as Todo[]).filter(
                    (item) => item.condition === false
                  )
                );
              }}
            >
              Active
            </button>
            <button
              className="mx-4 hover:text-blue-500 transition-colors"
              onClick={() => {
                setFilteredData(
                  (data.data as Todo[]).filter(
                    (item) => item.condition === true
                  )
                );
              }}
            >
              Completed
            </button>
          </div>
          <button
            className="hover:text-blue-500 transition-colors"
            onClick={() => {
              handleDeleteAll();
            }}
          >
            Clean Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerList;
