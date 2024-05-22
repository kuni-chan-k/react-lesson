import { Helmet } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const Head: React.FC<HeadProps> = ({ title, description, children }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | React100本ノック ~ くにちゃん"` : "React100本ノック"}</title>
      <meta name="description" content={description ?? "Reactの技術力向上のためのページです"} />
      {children}
    </Helmet>
  );
};

export default Head;
