'use client';

import React from 'react';

interface TabsProps {
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ children }: TabsProps) {
  return <div>{children}</div>;
}

export function TabsList({ children }: TabsListProps) {
  return <div className="flex gap-2">{children}</div>;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  return (
    <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all">
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  return <div>{children}</div>;
}
