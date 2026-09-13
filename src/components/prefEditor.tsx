import { useState } from "react";
import { Field, Input, Segmented } from "./ui";
import { Icon } from "./icons";
import { INTEREST_OPTIONS } from "../data";
import type { Preferences, WalkingLevel } from "../types";

export function TagInput({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options?: string[];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = (v: string) => {
    const t = v.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <Field label={label}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 text-[12px] bg-surface-3 border border-line rounded-md pl-2 pr-1 py-0.5">
              {v}
              <button onClick={() => onChange(value.filter((x) => x !== v))} className="text-faint hover:text-bad">
                <Icon.close size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          }
        }}
      />
      {options && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {options
            .filter((o) => !value.includes(o))
            .map((o) => (
              <button
                key={o}
                onClick={() => add(o)}
                className="text-[12px] text-muted hover:text-ink bg-surface-2 border border-line-soft rounded-md px-2 py-0.5 transition-colors"
              >
                + {o}
              </button>
            ))}
        </div>
      )}
    </Field>
  );
}

export function PrefEditor({ prefs, onChange }: { prefs: Preferences; onChange: (p: Preferences) => void }) {
  const set = (patch: Partial<Preferences>) => onChange({ ...prefs, ...patch });
  return (
    <div className="space-y-5">
      <div className="grid @min-[640px]/phone:grid-cols-2 gap-4">
        <Field label="Budget preference">
          <Segmented value={prefs.budget} onChange={(v) => set({ budget: v })} options={[{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }]} />
        </Field>
        <Field label="Travel pace">
          <Segmented value={prefs.pace} onChange={(v) => set({ pace: v })} options={[{ value: "Relaxed", label: "Relaxed" }, { value: "Balanced", label: "Balanced" }, { value: "Packed", label: "Packed" }]} />
        </Field>
        <Field label="Walking tolerance">
          <Segmented value={prefs.walking} onChange={(v) => set({ walking: v as WalkingLevel })} options={[{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }]} />
        </Field>
        <Field label="Activity intensity">
          <Segmented value={prefs.intensity} onChange={(v) => set({ intensity: v as WalkingLevel })} options={[{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }]} />
        </Field>
      </div>
      <TagInput label="Interests" value={prefs.interests} onChange={(v) => set({ interests: v })} options={INTEREST_OPTIONS} placeholder="Type and press Enter" />
      <TagInput label="Food preferences" value={prefs.food} onChange={(v) => set({ food: v })} placeholder="e.g. Japanese, Vegetarian" />
      <div className="grid @min-[640px]/phone:grid-cols-2 gap-4">
        <TagInput label="Must-do" value={prefs.mustDo} onChange={(v) => set({ mustDo: v })} placeholder="Add a must-do" />
        <TagInput label="Avoid" value={prefs.avoid} onChange={(v) => set({ avoid: v })} placeholder="Add to avoid" />
      </div>
      <Field label="Accessibility / mobility needs" hint="Optional. Only what the traveller chooses to share.">
        <Input value={prefs.accessibility} onChange={(e) => set({ accessibility: e.target.value })} placeholder="e.g. Prefers minimal stairs" />
      </Field>
    </div>
  );
}
