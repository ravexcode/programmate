export default function useAnimationClose(
  component: HTMLElement,
  animation_name: string,
  class_to_add: string,
  class_to_remove: string
){
  const close_animation = (e: AnimationEvent) => {
    if(e.animationName !== animation_name) return;

    component.classList.replace(class_to_remove, class_to_add);
    return;
  }

  component.addEventListener("animationend", (e: AnimationEvent) => close_animation(e));

  component.removeEventListener("animationend",  (e: AnimationEvent) => close_animation(e));
}