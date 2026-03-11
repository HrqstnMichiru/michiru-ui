import type { DirectiveBinding } from "vue";

const createRipple = (event: MouseEvent, el: HTMLElement) => {
    const oldRipple = el.querySelector(".ripple");
    if (oldRipple) oldRipple.remove();

    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = el.getBoundingClientRect(); // 获取元素的尺寸和位置
    const x = event.clientX - rect.left; // 计算点击位置相对于元素左上角的坐标
    const y = event.clientY - rect.top; // 计算点击位置相对于元素左上角的坐标

    // 计算点击位置到四个角的距离，找出最远的距离
    const distanceToTopLeft = Math.sqrt(x * x + y * y); // 到左上角的距离
    const distanceToTopRight = Math.sqrt((rect.width - x) * (rect.width - x) + y * y); // 到右上角的距离
    const distanceToBottomLeft = Math.sqrt(x * x + (rect.height - y) * (rect.height - y)); // 到左下角的距离
    const distanceToBottomRight = Math.sqrt((rect.width - x) * (rect.width - x) + (rect.height - y) * (rect.height - y)); // 到右下角的距离

    const maxDistance = Math.max(distanceToTopLeft, distanceToTopRight, distanceToBottomLeft, distanceToBottomRight); // 最远距离

    // 波纹的初始大小（取较短边作为基准）
    const size = Math.min(rect.width, rect.height);

    // 计算放大倍数：需要扩展到最远角的距离，所以是 (maxDistance * 2) / size
    const scale = (maxDistance * 2) / size;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.setProperty("--ripple-scale", scale.toString());
    el.appendChild(ripple);
    return ripple;
};

const ripple = {
    mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
        el.style.position = el.style.position || "relative";
        el.style.overflow = "hidden";
        if (binding.value === undefined || binding.value === true) {
            let rippleEl: HTMLSpanElement | null = null;
            let isMouseUp = false;
            let isAnimationEnded = false;

            el.addEventListener("mousedown", e => {
                rippleEl = createRipple(e, el);
                console.log("Ripple created at", { x: e.clientX, y: e.clientY });
                console.log("Ripple element:", rippleEl);
                isMouseUp = false;
                isAnimationEnded = false;

                // 监听动画结束
                rippleEl?.addEventListener("animationend", () => {
                    console.log("Ripple animation ended");
                    isAnimationEnded = true;
                    // 如果鼠标已经抬起且动画结束，则移除
                    if (isMouseUp) {
                        console.log("Removing ripple element");
                        rippleEl?.remove();
                        rippleEl = null;
                    }
                });
            });

            el.addEventListener("mouseup", () => {
                isMouseUp = true;
                // 如果动画已经结束，则直接移除
                if (isAnimationEnded) {
                    rippleEl?.remove();
                    rippleEl = null;
                }
            });

            el.addEventListener("mouseleave", () => {
                isMouseUp = true;
                // 如果动画已经结束，则直接移除
                if (isAnimationEnded) {
                    rippleEl?.remove();
                    rippleEl = null;
                }
            });
        }
    }
};

export default ripple;
