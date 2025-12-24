"use client";

import React, { useEffect, useState } from "react";
import { fetchCodePenOEmbed, isValidCodePenUrl, type CodePenOEmbedResponse } from "@/lib/utils";
import { FeatherAlertCircle, FeatherLoader } from "@subframe/core";

interface CodePenEmbedProps {
  url: string;
  height?: number;
  showPreview?: boolean;
}

export function CodePenEmbed({ url, height = 400, showPreview = true }: CodePenEmbedProps) {
  const [oembedData, setOembedData] = useState<CodePenOEmbedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !isValidCodePenUrl(url)) {
      setOembedData(null);
      setError(null);
      return;
    }

    const fetchEmbed = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCodePenOEmbed(url, height);
        setOembedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load CodePen embed");
        setOembedData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbed();
  }, [url, height]);

  if (!url) {
    return null;
  }

  if (!isValidCodePenUrl(url)) {
    return (
      <div className="flex w-full items-start gap-2 rounded-md bg-error-50 px-4 py-3">
        <FeatherAlertCircle className="text-body font-body text-error-600" />
        <span className="text-caption font-caption text-error-900">
          Please enter a valid CodePen URL
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 px-4 py-12">
        <FeatherLoader className="text-body font-body text-subtext-color animate-spin" />
        <span className="text-body font-body text-subtext-color">
          Loading CodePen preview...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full items-start gap-2 rounded-md bg-error-50 px-4 py-3">
        <FeatherAlertCircle className="text-body font-body text-error-600" />
        <span className="text-caption font-caption text-error-900">
          {error}
        </span>
      </div>
    );
  }

  if (!oembedData) {
    return null;
  }

  if (showPreview) {
    return (
      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-body-bold font-body-bold text-default-font">
              {oembedData.title}
            </span>
            <span className="text-caption font-caption text-subtext-color">
              by {oembedData.author_name}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption font-caption text-brand-600 hover:text-brand-700"
          >
            View on CodePen
          </a>
        </div>
        <div
          className="w-full rounded-md border border-solid border-neutral-border overflow-hidden"
          dangerouslySetInnerHTML={{ __html: oembedData.html }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-md border border-solid border-neutral-border overflow-hidden"
      dangerouslySetInnerHTML={{ __html: oembedData.html }}
    />
  );
}
