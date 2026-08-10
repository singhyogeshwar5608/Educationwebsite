import { Link } from "react-router-dom";
import logoImg from "@/assets/Logo/Logo.png";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <img
        src={logoImg}
        alt="Z-TECH Career Institute"
        className="h-[42px] w-auto object-contain"
      />
      <div className="leading-tight">
        <span className="font-extrabold text-base tracking-tight text-navy-dark block leading-none">
          Z-TECH
        </span>
        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-navy block leading-none mt-0.5">
          Career Institute
        </span>
      </div>
    </Link>
  );
}
