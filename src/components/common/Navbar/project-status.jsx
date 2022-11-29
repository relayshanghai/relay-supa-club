import {ProgressBar} from "components/progress-bars";

const ProjectStatus = () => {
  const items = [
    {
      title: "Mobile app development",
      percent: 33,
      color: "bg-green-500",
    },
    {
      title: "Deploy github project",
      percent: 50,
      color: "bg-yellow-500",
    },
    {
      title: "Customer development",
      percent: 66,
      color: "bg-red-500",
    },
    {
      title: "Database backup",
      percent: 25,
      color: "bg-indigo-500",
    },
    {
      title: "Release version 1.4",
      percent: 80,
      color: "bg-blue-500",
    },
  ];
  return (
    <>
      <div className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-full p-2 text-xs font-bold tracking-wider uppercase">
        Project status
      </div>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col p-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold">{item.title}</div>
              <div className="text-xs whitespace-nowrap">{item.percent}%</div>
            </div>
            <ProgressBar width={item.percent} color={item.color} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectStatus;
