const EmptyState = () => {
  return (
    <div
      className={
        "flex flex-1 flex-col rounded-lg border border-dashed items-center justify-center px-4 py-8 text-center"
      }
    >
      <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Move a task here or create a new one.
      </p>
    </div>
  );
};

export default EmptyState;
