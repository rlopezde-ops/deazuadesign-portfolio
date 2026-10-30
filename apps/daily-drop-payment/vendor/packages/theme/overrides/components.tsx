import {
    Button,
    Divider,
    Input,
    type MantineThemeComponents,
    Menu,
    Modal,
    Notification,
    Pagination,
    Popover,
    Portal,
    Radio,
    Skeleton,
    Switch,
    Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

import components from "./components.module.css";
import notificationClasses from "./notification.module.css";

export const TRANSITION_DURATION = 300;

export const componentOverrides: MantineThemeComponents = {
    Button: Button.extend({
        classNames: {
            root: components.buttonVariants,
        },
        defaultProps: {
            color: "asurion",
            size: "md",
            radius: "xl",
            fz: "sm",
            fw: "400",
        },
    }),
    Input: Input.extend({
        classNames: { input: components.input },
    }),
    Radio: Radio.extend({
        classNames: {
            body: components.radio,
        },
    }),
    DatePickerInput: DatePickerInput.extend({
        classNames: {
            input: components.datePickerInput,
        },
    }),
    Divider: Divider.extend({
        classNames: {
            root: components.divider,
        },
    }),
    Menu: Menu.extend({
        classNames: {
            dropdown: components.menu,
        },
    }),
    Modal: Modal.extend({
        classNames: {
            header: components.modalHeader,
            title: components.modalTitle,
            content: components.modalContent,
        },
        defaultProps: {
            padding: "xl",
            radius: "md",
            transitionProps: {
                transition: "slide-up",
                duration: TRANSITION_DURATION,
                timingFunction: "ease",
            },
        },
    }),
    Notification: Notification.extend({
        classNames: notificationClasses,
    }),
    Pagination: Pagination.extend({
        defaultProps: {
            getItemProps: (page) => ({
                title: `Go to page ${page}`,
            }),
            getControlProps: (control) => ({
                title: `Go to ${control} page`,
            }),
        },
    }),
    Popover: Popover.extend({
        defaultProps: {
            hideDetached: false,
        },
    }),
    Portal: Portal.extend({
        defaultProps: {
            reuseTargetNode: false,
        },
    }),
    Switch: Switch.extend({
        defaultProps: {
            withThumbIndicator: false,
        },
    }),
    Tooltip: Tooltip.extend({
        classNames: {
            tooltip: components.tooltip,
            arrow: components.tooltipArrow,
        },
        defaultProps: {
            withArrow: true,
            arrowSize: 8,
        },
    }),
    Image: Button.extend({
        styles: {
            root: { imageRendering: "-webkit-optimize-contrast" },
        },
    }),
    Skeleton: Skeleton.extend({
        classNames: {
            root: components.skeleton,
        },
    }),
};
