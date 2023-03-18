import { FC as ReactFC, PropsWithChildren } from 'react';

export type FC<T = unknown> = ReactFC<PropsWithChildren<T>>;
