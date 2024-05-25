import { Button } from "@/components/Button";
import styles from "./Overlay.module.css";

interface Props {
  children: React.ReactNode;
  isActive: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
}

export default function Overlay({ isActive, children, onClose }: Props) {
  return (
    <div
      className={`prevent-select fixed left-0 top-0 bottom-0 right-0 z-[999] bg-slate-600 ${
        isActive ? styles.active_overlay : styles.close_overlay
      } ${styles.root}`}
    >
      {onClose && (
        <div className="flex lg:justify-end justify-start p-4">
          <Button color="orange" onClick={onClose}>
            Exit
          </Button>
        </div>
      )}
      <div className="w-full flex pt-[20vh] justify-center">
        {isActive ? children : null}
      </div>
    </div>
  );
}
