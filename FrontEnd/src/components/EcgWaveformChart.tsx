import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ReferenceDot 
} from 'recharts';
import { EcgAnalysisResult } from '../types/ecg';
import { ZoomIn, ZoomOut, RotateCcw, Activity, HelpCircle, Eye, Sliders } from 'lucide-react';

interface EcgWaveformChartProps {
  result: EcgAnalysisResult;
}

export function EcgWaveformChart({ result }: EcgWaveformChartProps) {
  const [zoom, setZoom] = useState<number>(40); // 10% (zoomed in) to 100% (full trace)
  const [scroll, setScroll] = useState<number>(0); // 0 (start) to 100 (end of signal)
  const [activeLead, setActiveLead] = useState<'Lead II' | 'Lead V5' | 'Lead V1'>('Lead II');

  // Regenerate simulated high-resolution continuous signal whenever the diagnosis result or active lead changes
  const fullSignal = useMemo(() => {
    const { features, status } = result;
    const isAFib = result.prediction.toLowerCase().includes("atrial fibrillation");
    const isTachy = result.prediction.toLowerCase().includes("tachycardia");
    const isVPB = result.prediction.toLowerCase().includes("beats");

    const sampleRate = 250; // 250 samples per second
    const totalDuration = 6.0; // 6 seconds duration
    const totalSamples = sampleRate * totalDuration;
    
    // Heart rate-driven period in seconds
    const hr = features.HR || 72;
    const basePeriod = 60 / hr; 

    // Generate random variable RR intervals for AFib (irregularly irregular rhythm)
    const beatIntervals: number[] = [];
    let accumulatedTime = 0;
    while (accumulatedTime < totalDuration + 2) {
      let currentPeriod = basePeriod;
      if (isAFib) {
        // High rhythm randomness in AFib
        currentPeriod = basePeriod * (0.75 + Math.random() * 0.5);
      } else if (isVPB) {
        // Every 3rd beat is premature (VPB)
        const beatIndex = beatIntervals.length;
        if (beatIndex % 3 === 2) {
          currentPeriod = basePeriod * 0.6; // Prematurebeat
        } else if (beatIndex % 3 === 0) {
          currentPeriod = basePeriod * 1.3; // Compensatory pause
        }
      }
      beatIntervals.push(currentPeriod);
      accumulatedTime += currentPeriod;
    }

    const dataPoints = [];
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate; // Time in seconds
      
      // Determine which beat cycle we are in
      let accumulated = 0;
      let beatIdx = 0;
      for (let b = 0; b < beatIntervals.length; b++) {
        if (accumulated + beatIntervals[b] > t) {
          beatIdx = b;
          break;
        }
        accumulated += beatIntervals[b];
      }

      const cyclePeriod = beatIntervals[beatIdx] || basePeriod;
      const tWithinBeat = t - accumulated;
      const phase = tWithinBeat / cyclePeriod; // 0 to 1 scale

      let voltage = 0;
      let waveSegment = "Baseline";
      let explanation = "Isoelectric baseline marking period of relative cardiac stillness.";
      let hoverMetric = "";
      let hoverValue = "";

      // Is the current beat a premature VPB?
      const isCurrentBeatVPB = isVPB && (beatIdx % 3 === 2);

      // --- ECG WAVEFORM MODELING VIA PROCEDURAL GAUSSIANS ---
      
      // 1. P Wave (Atrial Depolarization)
      const pOnset = 0.05;
      const pPeak = 0.12;
      const pOffset = 0.18;
      const hasPWave = features.PR > 0 && !isAFib;

      if (hasPWave && phase >= pOnset && phase < pOffset) {
        const pWidth = 0.04;
        const pAmp = activeLead === 'Lead V1' ? -0.05 : 0.15; // Negative or biphasic in V1
        voltage += pAmp * Math.exp(-Math.pow((phase - pPeak) / pWidth, 2));
        waveSegment = "P Wave";
        explanation = "Atrial Depolarization: Marks electrical activation causing upper heart chamber contraction.";
        hoverMetric = "PR Interval";
        hoverValue = `${features.PR} ms`;
      }
      // 2. PR Segment Flat line
      else if (hasPWave && phase >= pOffset && phase < 0.22) {
        waveSegment = "PR Segment";
        explanation = "AV Conduction Delay: Safe pause allowing ventricles to completely fill with blood.";
        hoverMetric = "PR Interval";
        hoverValue = `${features.PR} ms`;
      }

      // 3. QRS Complex (Ventricular Depolarization)
      const qrsCenter = 0.24;
      const qrsWidthFactor = (features.QRS / 90) * 0.015; // wide QRS represents hypertrophy/conduction delay

      if (phase >= qrsCenter - 0.08 && phase < qrsCenter + 0.08) {
        // Procedurally model Q, R, and S waves in high-fidelity
        const qPhase = qrsCenter - 0.02;
        const rPhase = qrsCenter;
        const sPhase = qrsCenter + 0.02;

        const qAmp = activeLead === 'Lead V5' ? -0.15 : -0.1;
        const rAmp = activeLead === 'Lead V5' ? (features.RV5 || 1.4) : activeLead === 'Lead V1' ? 0.2 : 1.5;
        const sAmp = activeLead === 'Lead V1' ? -(features.SV1 || 0.8) : -0.3;

        // Custom abnormal VPB morphology (Wide, deeply annotated, slurred waves)
        if (isCurrentBeatVPB) {
          const vpbWidth = 0.06;
          // inverted bizarre QRS complex for VPB
          voltage += -1.4 * Math.exp(-Math.pow((phase - rPhase) / vpbWidth, 2));
          voltage += 0.3 * Math.exp(-Math.pow((phase - (rPhase + 0.04)) / 0.03, 2));
          waveSegment = "VPB QRS Complex";
          explanation = "Premature Abnormal Depolarization: Wide, bizarre QRS waveform arising from atypical ventricular conduction.";
          hoverMetric = "QRS Duration";
          hoverValue = `${features.QRS} ms`;
        } else {
          // Standard QRS waveform
          voltage += qAmp * Math.exp(-Math.pow((phase - qPhase) / 0.01, 2));
          voltage += rAmp * Math.exp(-Math.pow((phase - rPhase) / qrsWidthFactor, 2));
          voltage += sAmp * Math.exp(-Math.pow((phase - sPhase) / 0.012, 2));
          waveSegment = "QRS Complex";
          explanation = "Ventricular Depolarization: Core pulse triggering massive muscular ventricular pumping action.";
          hoverMetric = "QRS Duration";
          hoverValue = `${features.QRS} ms`;
        }
      }

      // 4. ST Segment
      const stOnset = qrsCenter + 0.08;
      const tOnsetPhase = 0.42;
      if (phase >= stOnset && phase < tOnsetPhase) {
        // Elevate or depress if abnormal
        const isMIsign = status === 'moderate' && result.prediction.includes("Abnormal");
        voltage += isMIsign ? 0.15 : 0; 
        waveSegment = "ST Segment";
        explanation = "Early Ventricular Repolarization: Neutral state prior to ventricular relaxation.";
        hoverMetric = "QT Interval";
        hoverValue = `${features.QT} ms`;
      }

      // 5. T Wave (Ventricular Repolarization)
      const tPeak = 0.52;
      const tWidth = 0.06;
      const tOnsetZone = tOnsetPhase;
      const tOffsetZone = 0.68;

      if (phase >= tOnsetZone && phase < tOffsetZone) {
        const tAmp = activeLead === 'Lead V1' ? -0.05 : 0.35;
        voltage += tAmp * Math.exp(-Math.pow((phase - tPeak) / tWidth, 2));
        waveSegment = "T Wave";
        explanation = "Ventricular Repolarization: Electrical recharging phase allowing heart ventricles to rest.";
        hoverMetric = "QTc Duration";
        hoverValue = `${features.QTc} ms`;
      }

      // 6. Atrial Fibrillation baseline oscillation noise (f-waves)
      if (isAFib) {
        // High frequency micro chaotic oscillations representing quivering atria
        voltage += 0.08 * Math.sin(2 * Math.PI * 34 * t) + 0.04 * Math.cos(2 * Math.PI * 14 * t);
      }

      // Add minimal background electrical line noise for maximum visual realism
      voltage += 0.012 * Math.sin(2 * Math.PI * 50 * t);

      dataPoints.push({
        idx: i,
        time: Number(t.toFixed(3)),
        voltage: Number(voltage.toFixed(3)),
        segment: waveSegment,
        description: explanation,
        metric: hoverMetric || "ISO Constant",
        value: hoverValue || "0.0 mV"
      });
    }

    return dataPoints;
  }, [result, activeLead]);

  // Handle active slice of signal using zoom and scroll coordinates
  const viewSignal = useMemo(() => {
    const totalPoints = fullSignal.length;
    
    // Zoom is percentage of points visible (e.g. at 10% zoom, 150 points are visible)
    const pointsToShow = Math.max(80, Math.floor(totalPoints * (zoom / 100)));
    
    // Scroll maps to starting index
    const maxStartIndex = totalPoints - pointsToShow;
    const startIndex = Math.floor(maxStartIndex * (scroll / 100));
    
    return fullSignal.slice(startIndex, startIndex + pointsToShow);
  }, [fullSignal, zoom, scroll]);

  // Adjust display zoom
  const handleZoomIn = () => setZoom(prev => Math.max(10, prev - 10));
  const handleZoomOut = () => setZoom(prev => Math.min(100, prev + 10));
  const handleZoomReset = () => {
    setZoom(40);
    setScroll(0);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 space-y-5 shadow-sm">
      
      {/* Waveform Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-950 dark:text-neutral-50 tracking-tight">
              Interactive Signal Waveform
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
              Zoom & drag timeline to audit raw cardiac signal phases. Hover over waves for definition.
            </p>
          </div>
        </div>

        {/* Lead select pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {(['Lead II', 'Lead V5', 'Lead V1'] as const).map((lead) => (
            <button
              key={lead}
              onClick={() => setActiveLead(lead)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeLead === lead
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400 border border-slate-100 dark:border-neutral-800'
              }`}
            >
              {lead}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Canvas Grid Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-950">
        
        {/* Procedural ECG Grid SVG Overlay Background to match professional grid papers */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              {/* Fine ECG pink coordinate grid pattern */}
              <pattern id="ecg-fine-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f43f5e" strokeWidth="0.5" />
              </pattern>
              {/* Bold ECG grid pattern every 5 squares */}
              <pattern id="ecg-bold-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#ecg-fine-grid)" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ecg-bold-grid)" />
          </svg>
        </div>

        {/* Recharts Container */}
        <div className="h-64 sm:h-72 w-full pt-4 pr-4 pl-1 relative z-10 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={viewSignal} 
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val}s`}
              />
              <YAxis 
                domain={[-1.2, 2.2]} 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val} mV`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 dark:bg-neutral-900 border border-slate-800 rounded-xl p-3 shadow-xl max-w-xs space-y-2 text-white text-[11px] animate-fade-in">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-extrabold text-blue-400 uppercase tracking-widest font-mono">
                            {data.segment}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {data.time}s
                          </span>
                        </div>
                        <p className="leading-normal font-sans text-slate-200">
                          {data.description}
                        </p>
                        {data.metric !== "ISO Constant" && (
                          <div className="flex items-center justify-between bg-blue-950/40 p-1.5 rounded-lg border border-blue-900/50 mt-1">
                            <span className="font-bold text-blue-300 font-mono">{data.metric}:</span>
                            <span className="font-extrabold text-white font-mono">{data.value}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Voltage measure:</span>
                          <span className="font-bold text-white pr-0.5">{data.voltage} mV</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />
              {/* Baseline reference Line at 0 mV */}
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
              
              {/* Draw ECG Continuous Line Signal */}
              <Line 
                type="monotone" 
                dataKey="voltage" 
                stroke="#3b82f6" 
                strokeWidth={2.4} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead / Peak Label overlays for visual education */}
        <div className="absolute bottom-3 left-4 bg-slate-900/95 dark:bg-neutral-900/95 py-1 px-2 rounded-md border border-slate-800 text-[10px] font-mono font-bold text-slate-300 shrink-0 z-20 flex items-center gap-1.5 pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>Active Viewport Duration: {((viewSignal[viewSignal.length - 1]?.time - viewSignal[0]?.time) || 0).toFixed(2)}s</span>
        </div>
      </div>

      {/* Axis Scroll and Zoom Navigation Sliders */}
      <div className="space-y-4 bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-slate-150 dark:border-neutral-800/60">
        
        {/* Horizontal Timeline Scroll Scrubber */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Timeline Scrubber
            </span>
            <span>Offset: {scroll}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scroll}
            onChange={(e) => setScroll(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-ew-resize accent-blue-600 pb-0.5"
            aria-label="Scroll waveform timeline"
          />
        </div>

        {/* Zoom adjustment panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1.5 border-t border-slate-200/50 dark:border-neutral-800/40">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-neutral-500 block">
                Magnification Rate
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-neutral-300">
                {100 - zoom}% Zoom Scale
              </span>
            </div>
            {/* Range slider for zoom */}
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 sm:w-32 h-1 bg-slate-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-zoom-in accent-blue-600 pb-0.5"
              aria-label="Adjust zoom rate"
            />
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2">
            <button
              id="zoom-out-btn"
              onClick={handleZoomOut}
              disabled={zoom >= 100}
              className="p-2 bg-white hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 rounded-xl transition-all cursor-pointer disabled:opacity-40"
              title="Zoom Out (Show More beats)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="zoom-in-btn"
              onClick={handleZoomIn}
              disabled={zoom <= 10}
              className="p-2 bg-white hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 rounded-xl transition-all cursor-pointer disabled:opacity-40"
              title="Zoom In (Magnify single beat)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="zoom-reset-btn"
              onClick={handleZoomReset}
              className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 rounded-xl transition-all text-xs font-semibold cursor-pointer"
              title="Restore initial size"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
