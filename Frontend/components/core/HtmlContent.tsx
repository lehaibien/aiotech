import classes from "./HtmlContent.module.css";

export type HtmlContentProps = {
  content: string;
};

export const HtmlContent = ({ content }: HtmlContentProps) => {
  return (
    <article
      className={classes.root}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
