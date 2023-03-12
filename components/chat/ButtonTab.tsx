import { Button } from "@mui/material";

const ButtonInTabs = ({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
}) => {
  return (
    <Button className={className} onClick={onClick}>
      {children}
    </Button>
  );
};
export default ButtonInTabs;
