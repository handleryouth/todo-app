import axios from "axios";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import { mutate } from "swr";
import { Todo } from "types";

const List = ({ title, _id, condition, index, moveCard }: Todo) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "list",
    collect: (monitor) => {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover: (item: Todo, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "list",
    item: () => {
      return { _id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleDeleteList = useCallback(() => {
    axios({
      method: "DELETE",
      url: "/api/todo",
      data: {
        id: _id,
        condition: true,
      },
    })
      .then(() => {
        mutate("/api/todo");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [_id]);

  const handleCheckList = useCallback(() => {
    axios({
      method: "PATCH",
      url: "/api/todo",
      data: {
        id: _id,
        condition: !condition,
      },
    }).then(() => {
      mutate("/api/todo");
    });
  }, [_id, condition]);

  return (
    <div
      ref={ref}
      className="px-4 flex justify-between items-center  bg-slate-400"
      data-handler-id={handlerId}
    >
      <p
        className={`text-xl py-5 cursor-default  ${
          condition && "line-through decoration-4"
        }`}
        onClick={() => {
          handleCheckList();
        }}
      >
        {title}
      </p>
      <div className="w-[20px] ">
        <Image
          src="/icon-cross.svg"
          className="cursor-pointer"
          alt="delete"
          layout="fixed"
          width={20}
          height={20}
          onClick={() => {
            handleDeleteList();
          }}
        />
      </div>
    </div>
  );
};

export default List;
