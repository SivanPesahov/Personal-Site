import GlassSurface from "./GlassSurface";

interface CommentProps {
  name: string;
  created_at: string;
  content: string;
}

function CommentComponent({ name, created_at, content }: CommentProps) {
  return (
    <>
      <GlassSurface width={"100%"} height={"auto"} borderRadius={24}>
        <div className="w-full p-4 flex flex-col gap-2">
          <div className="font-semibold text-gray-900 dark:text-white">
            User: {name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(created_at).toLocaleString()}
          </div>
          <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            Content: {content}
          </p>
        </div>
      </GlassSurface>
    </>
  );
}

export default CommentComponent;
