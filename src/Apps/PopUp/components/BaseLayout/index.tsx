import React from "react";
import style from "./base_layout.module.css";
import { CustomizableComponent } from "../../models/default.components";

interface iProps extends CustomizableComponent {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: iProps) => {
  return <div className={style.body}>{children}</div>;
};

export default BaseLayout;
