import React from "react";

export interface AccessDeniedProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function AccessDenied({
  title = "Access Restricted",
  message = "You do not meet the requirements for this feature.",
  actionLabel = "Build your Ethos reputation",
  actionHref = "https://ethos.network"
}: AccessDeniedProps) {
  return (
    <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-4 text-sm">{message}</p>
      <a
        href={actionHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-blue-600 hover:underline font-medium"
      >
        {actionLabel}
      </a>
    </div>
  );
}
