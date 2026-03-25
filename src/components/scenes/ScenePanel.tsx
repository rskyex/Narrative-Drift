"use client";

import { FeedScene } from "./FeedScene";
import { CompanionScene } from "./CompanionScene";
import { PoliticalScene } from "./PoliticalScene";

interface ScenePanelProps {
  encounterId: string;
  zoneId: number;
}

/**
 * Routes to the correct zone-specific scene visualization.
 */
export function ScenePanel({ encounterId, zoneId }: ScenePanelProps) {
  switch (zoneId) {
    case 1:
      return <FeedScene encounterId={encounterId} />;
    case 2:
      return <CompanionScene encounterId={encounterId} />;
    case 3:
      return <PoliticalScene encounterId={encounterId} />;
    default:
      return null;
  }
}
