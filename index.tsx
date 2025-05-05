// FPGABuildEstimator.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { HashRouter } from 'react-router-dom';

const TOOLCHAINS = ["Vivado", "Quartus", "Diamond"];
const OPT_LEVELS = ["O0", "O1", "O2", "O3"];
const CPUS = ["i5-9600K", "i7-12700K", "Ryzen 7 5800X", "Threadripper 3970X"];

export default function FPGABuildEstimator() {
  const [toolchain, setToolchain] = useState("Vivado");
  const [cpu, setCpu] = useState("i7-12700K");
  const [optLevel, setOptLevel] = useState("O2");
  const [luts, setLuts] = useState(10000);
  const [ffs, setFfs] = useState(10000);
  const [dsps, setDsps] = useState(100);

  const estimateTime = () => {
    const base = (luts + ffs) / 1000 + dsps / 10;
    const cpuFactor = cpu.includes("Threadripper") ? 0.5 : cpu.includes("Ryzen") ? 0.7 : 1.0;
    const optFactor = OPT_LEVELS.indexOf(optLevel) * 0.3 + 1;
    const toolchainFactor = toolchain === "Vivado" ? 1.2 : toolchain === "Quartus" ? 1.0 : 0.8;

    const synth = base * 2 * cpuFactor * optFactor * toolchainFactor;
    const impl = base * 3 * cpuFactor * optFactor * toolchainFactor;
    const bitgen = base * 1.5 * cpuFactor * optFactor * toolchainFactor;

    return {
      synthesis: synth,
      implementation: impl,
      bitstream: bitgen,
    };
  };

  const result = estimateTime();

  const formatTime = (minutes: number) => `${minutes.toFixed(1)} min (${(minutes / 60).toFixed(2)} hrs)`;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">⏱️ FPGA Build Time Estimator</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Toolchain</label>
          <Select onValueChange={setToolchain} value={toolchain}>
            <SelectTrigger>
              <SelectValue placeholder="Select Toolchain" />
            </SelectTrigger>
            <SelectContent>
              {TOOLCHAINS.map(tc => <SelectItem key={tc} value={tc}>{tc}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CPU</label>
          <Select onValueChange={setCpu} value={cpu}>
            <SelectTrigger>
              <SelectValue placeholder="Select CPU" />
            </SelectTrigger>
            <SelectContent>
              {CPUS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Optimization Level</label>
          <Select onValueChange={setOptLevel} value={optLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Optimization Level" />
            </SelectTrigger>
            <SelectContent>
              {OPT_LEVELS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1"># LUTs</label>
          <Input type="number" value={luts} onChange={e => setLuts(Number(e.target.value))} placeholder="# LUTs" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1"># FFs</label>
          <Input type="number" value={ffs} onChange={e => setFfs(Number(e.target.value))} placeholder="# FFs" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1"># DSPs</label>
          <Input type="number" value={dsps} onChange={e => setDsps(Number(e.target.value))} placeholder="# DSPs" />
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-semibold">🧮 Estimated Build Times</h2>
          <div>Synthesis: {formatTime(result.synthesis)}</div>
          <div>Implementation: {formatTime(result.implementation)}</div>
          <div>Bitstream Generation: {formatTime(result.bitstream)}</div>
        </CardContent>
      </Card>

      {/* Future: add chart, tips, or community average section here */}
    </div>
  );
}