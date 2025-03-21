import React from "react";

interface NavigationBarProps {
  topChildren: React.ReactNode;
  botChildren: React.ReactNode;
  notificationChildren: React.ReactNode;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  topChildren,
  botChildren,
  notificationChildren,
}) => {
  // const handleClick = (title: string) => {
  //   alert(`Clicked on ${title}`)
  // }

  return (
    <div className="fixed top-[48px] left-0 z-[999] h-[calc(100vh-48px)] w-56 flex flex-col items-start bg-white">
      <div className="border-l-[2px] border-light-gray absolute left-56 h-full" />
      <div className="relative flex flex-col py-3 pl-[20px] w-full box-border overflow-hidden h-[62%] min-h-[316px]">
        {React.Children.map(topChildren, (child, index) =>
          React.cloneElement(child as React.ReactElement, { key: index })
        )}
      </div>
      <div className="border-t border-light-gray w-[210px] self-center" />
      <div className="notification-box relative flex justify-center items-center w-full h-[24%]">
        {React.Children.map(notificationChildren, (child, index) =>
          React.cloneElement(child as React.ReactElement, { key: index })
        )}
      </div>
      <div className="relative flex flex-col py-2 pl-[20px] w-full box-border overflow-hidden h-[14%] min-h-[100px]">
        {React.Children.map(botChildren, (child, index) =>
          React.cloneElement(child as React.ReactElement, { key: index })
        )}
        <div className="w-[200px] self-center text-sm text-line-gray font-light">
          Developed by Group 7
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
