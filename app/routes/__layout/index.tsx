import ReactMarkdown from 'react-markdown';

export default function Index() {
  return (
    <div className="p-5 lg:p-8">
      Welcome to the Remix Cyberpunk Stack
      <ReactMarkdown children="## This is markup" remarkPlugins={[]} />
    </div>
  );
}
