import { Label } from '@/components/ui/label';
import type { SelectIcon, SelectOption } from '@/lib/coachOptions';

export function SelectField({
  id,
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  icon: SelectIcon;
  onChange: (value: string) => void;
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2" htmlFor={id}>
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <select
        id={id}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption?.description && (
        <p className="rounded-md bg-muted/60 px-3 py-2 text-xs leading-5 text-muted-foreground">
          {selectedOption.description}
        </p>
      )}
    </div>
  );
}
