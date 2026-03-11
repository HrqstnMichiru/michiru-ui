export interface MLinkProps {
    color?: string; // 链接激活颜色
    underline?: boolean; // 是否显示下划线
    disabled?: boolean; // 是否禁用链接
    href?: string; // 链接地址
    external?: boolean; // 是否为外部链接
    action?: "hover" | "always"; // 下划线和颜色的触发方式，hover表示鼠标悬停时触发，always表示一直显示
}
