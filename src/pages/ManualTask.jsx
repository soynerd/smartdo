import React from "react";
import { ListConverter } from "../components";

function SelfTask() {
  return <ListConverter selfTask={true} mainTitle={"Self Planner"} />;
}

export default SelfTask;
