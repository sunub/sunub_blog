"use client";

import Image from "next/image";
import styled, { css, keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
`;

export const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background-color: #e5e7eb;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const Caption = styled.figcaption`
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 0.5rem;
`;

export const StyledImage = styled(Image)<{
	$isLoading: boolean;
	$zoomed?: boolean;
}>`
  object-fit: contain;
  transition: opacity 0.3s ease;
  opacity: ${({ $isLoading }) => ($isLoading ? 0 : 1)};

  ${({ $zoomed }) =>
		$zoomed &&
		css`
      cursor: zoom-out;
      z-index: 10000;
    `}
`;
