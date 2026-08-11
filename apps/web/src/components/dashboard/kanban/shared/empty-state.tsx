const EmptyState = () => {
  return (
    <div
      className={
        "flex flex-1 flex-col border items-center justify-center py-8 text-center"
      }
    >
      <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Add a task or drag one here
      </p>
    </div>
  );
};

export default EmptyState;
