"use client"
import style from "./modal.module.css";
import {ReactNode, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";


export default function Modal({children} : {children : ReactNode}) {

    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
            dialogRef.current?.scrollTo({
                top: 0,
            })
        }
    }, []);

    return createPortal(
        <dialog className={style.modal}
                ref={dialogRef}
                onClose={() => router.back()}
                onClick={(e) => {
                    if ((e.target as HTMLElement).nodeName === "DIALOG") {
                        router.back();
                    }
                }}
        >
            {children}
        </dialog>,
        document.getElementById("modal-root") as HTMLElement
    );

}