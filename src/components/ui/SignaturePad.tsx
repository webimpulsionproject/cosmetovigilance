'use client';

import { useRef, useEffect } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';

interface Props { value: string; onChange: (v: string) => void; }

export default function SignaturePad({ value, onChange }: Props) {
  const ref = useRef<ReactSignatureCanvas>(null);

  useEffect(() => {
    if (ref.current && value && ref.current.isEmpty()) ref.current.fromDataURL(value);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-[#e6e6e6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#fafafa] border-b border-[#f0f0f0]">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#bbb]">Signature</span>
        <button
          type="button"
          onClick={() => { ref.current?.clear(); onChange(''); }}
          className="text-[12px] font-medium text-[#bbb] hover:text-red-400 transition-colors py-1 px-2"
        >
          Effacer
        </button>
      </div>
      <div className="bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><line x1=%220%22 y1=%2219%22 x2=%2220%22 y2=%2219%22 stroke=%22%23f0f0f0%22/></svg>')] bg-repeat touch-none select-none" style={{height:130}}>
        <ReactSignatureCanvas
          ref={ref}
          penColor="#111"
          canvasProps={{ className: 'w-full h-full block' }}
          onEnd={() => { if (ref.current) onChange(ref.current.toDataURL('image/png')); }}
        />
      </div>
      <div className={`px-4 py-2 border-t border-[#f0f0f0] transition-all ${value ? 'bg-[#f5f1fb]' : 'bg-[#fafafa]'}`}>
        <span className={`text-[11px] font-medium ${value ? 'text-[#6B3FA0]' : 'text-[#ccc]'}`}>
          {value ? 'Signature enregistrée' : 'Signez dans le cadre ci-dessus'}
        </span>
      </div>
    </div>
  );
}
