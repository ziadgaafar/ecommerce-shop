import { useTheme } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";

const CustomScrollbar = (props) => {
  const theme = useTheme();
  return (
    <Scrollbars
      style={{ width: "100vw", height: "100vh" }}
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: theme.palette.primary.main,
            zIndex: theme.zIndex.appBar,
          }}
        />
      )}
    >
      {props.children}
    </Scrollbars>
  );
};

export default CustomScrollbar;
