import { Button } from "@/components/ui/button";

export function LoadingState({ label = "正在加载..." }: { label?: string }) {
  return <div className="rounded-lg border border-line p-4 text-sm text-muted">{label}</div>;
}

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line p-5 text-center">
      <p className="text-sm text-muted">{title}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 p-4 text-sm text-red-700">
      <p>{message}</p>
      {onRetry ? (
        <Button className="mt-3" type="button" variant="outline" onClick={onRetry}>
          重试
        </Button>
      ) : null}
    </div>
  );
}
