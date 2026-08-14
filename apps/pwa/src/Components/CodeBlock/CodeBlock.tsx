import React from "react";

import "./CodeBlock.styles.css";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const classes = {
    ...baseClasses,
    container: [baseClasses.container, className].filter(Boolean).join(" "),
  };

  return <code className={classes.container}>{children}</code>;
};

const baseClasses = {
  container: ["code-block"].join(" "),
};
