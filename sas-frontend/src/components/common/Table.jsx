import { useRef, useEffect } from "react";

export const Table = ({ columns, data, actions, rowKey = "_id" }) => {
  const scrollContainerRef = useRef(null);

  const getRowKey = (item) =>
    typeof rowKey === "function" ? rowKey(item) : item[rowKey];

  // Improved drag-to-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    const handleMouseDown = (e) => {
      // Don't start drag on clickable elements
      if (e.target.closest('button, a, input, select, textarea')) {
        return;
      }
      
      isDown = true;
      isDragging = false;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      scrollContainer.style.cursor = 'grabbing';
      scrollContainer.style.userSelect = 'none';
      e.preventDefault();
    };

    const handleMouseLeave = () => {
      isDown = false;
      isDragging = false;
      scrollContainer.style.cursor = 'grab';
      scrollContainer.style.userSelect = '';
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.style.cursor = 'grab';
      scrollContainer.style.userSelect = '';
      
      // Small delay to prevent click events if we were dragging
      if (isDragging) {
        setTimeout(() => {
          isDragging = false;
        }, 10);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Increase speed multiplier
      
      // If mouse has moved significantly, we're dragging
      if (Math.abs(walk) > 5) {
        isDragging = true;
      }
      
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    // Prevent default drag behavior on images and other elements
    const handleDragStart = (e) => {
      e.preventDefault();
    };

    // Add event listeners
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('dragstart', handleDragStart);

    // Global mouse up listener to handle mouse up outside the container
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="max-w-full overflow-x-auto cursor-grab select-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
      style={{ scrollBehavior: 'auto' }}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full relative" style={{ minWidth: '2000px' }}>
          <thead className="sticky top-0 z-50 bg-white dark:bg-slate-800">
            <tr className="bg-slate-50 dark:bg-slate-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="py-3 px-4 border-b border-slate-200 dark:border-slate-600 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[150px]"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-600 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[120px] sticky right-0 bg-slate-50 dark:bg-slate-700 z-20">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={getRowKey(item)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-3 px-4 border-b border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap min-w-[150px]"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key] || "-"}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3 px-4 border-b border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap min-w-[120px] sticky right-0 bg-white dark:bg-slate-800 z-10">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-8 px-4 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
