import * as React from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import * as Recharts from 'recharts';
import * as accordion from '@/components/ui/accordion';
import * as alertDialog from '@/components/ui/alert-dialog';
import * as alert from '@/components/ui/alert';
import * as aspectRatio from '@/components/ui/aspect-ratio';
import * as attachment from '@/components/ui/attachment';
import * as avatar from '@/components/ui/avatar';
import * as badge from '@/components/ui/badge';
import * as breadcrumb from '@/components/ui/breadcrumb';
import * as bubble from '@/components/ui/bubble';
import * as buttonGroup from '@/components/ui/button-group';
import * as button from '@/components/ui/button';
import * as calendar from '@/components/ui/calendar';
import * as card from '@/components/ui/card';
import * as carousel from '@/components/ui/carousel';
import * as chart from '@/components/ui/chart';
import * as checkbox from '@/components/ui/checkbox';
import * as collapsible from '@/components/ui/collapsible';
import * as combobox from '@/components/ui/combobox';
import * as command from '@/components/ui/command';
import * as contextMenu from '@/components/ui/context-menu';
import * as dialog from '@/components/ui/dialog';
import * as direction from '@/components/ui/direction';
import * as drawer from '@/components/ui/drawer';
import * as dropdownMenu from '@/components/ui/dropdown-menu';
import * as empty from '@/components/ui/empty';
import * as field from '@/components/ui/field';
import * as hoverCard from '@/components/ui/hover-card';
import * as inputGroup from '@/components/ui/input-group';
import * as inputOtp from '@/components/ui/input-otp';
import * as input from '@/components/ui/input';
import * as item from '@/components/ui/item';
import * as kbd from '@/components/ui/kbd';
import * as label from '@/components/ui/label';
import * as marker from '@/components/ui/marker';
import * as menubar from '@/components/ui/menubar';
import * as messageScroller from '@/components/ui/message-scroller';
import * as message from '@/components/ui/message';
import * as nativeSelect from '@/components/ui/native-select';
import * as navigationMenu from '@/components/ui/navigation-menu';
import * as pagination from '@/components/ui/pagination';
import * as popover from '@/components/ui/popover';
import * as progress from '@/components/ui/progress';
import * as radioGroup from '@/components/ui/radio-group';
import * as resizable from '@/components/ui/resizable';
import * as scrollArea from '@/components/ui/scroll-area';
import * as select from '@/components/ui/select';
import * as separator from '@/components/ui/separator';
import * as sheet from '@/components/ui/sheet';
import * as sidebar from '@/components/ui/sidebar';
import * as skeleton from '@/components/ui/skeleton';
import * as slider from '@/components/ui/slider';
import * as sonner from '@/components/ui/sonner';
import * as spinner from '@/components/ui/spinner';
import * as switchComponent from '@/components/ui/switch';
import * as table from '@/components/ui/table';
import * as tabs from '@/components/ui/tabs';
import * as textarea from '@/components/ui/textarea';
import * as toggleGroup from '@/components/ui/toggle-group';
import * as toggle from '@/components/ui/toggle';
import * as tooltip from '@/components/ui/tooltip';
import { LucideIcon, lucideIconNames } from './lucide-icon';
import type { ComponentRegistry } from '../mdx/compiler';

export const COMPONENT_REGISTRY_VERSION = 5;

export function getComponentRegistry(): ComponentRegistry {
	return Object.freeze({
		React,
		Recharts,
		Children: React.Children,
		Fragment: React.Fragment,
		cloneElement: React.cloneElement,
		createElement: React.createElement,
		useCallback: React.useCallback,
		useContext: React.useContext,
		useEffect: React.useEffect,
		useId: React.useId,
		useMemo: React.useMemo,
		useReducer: React.useReducer,
		useRef: React.useRef,
		useState: React.useState,
		DynamicIcon,
		Icon: LucideIcon,
		LucideIcon,
		lucideIconNames,
		...accordion,
		...alert,
		...alertDialog,
		...aspectRatio,
		...attachment,
		...avatar,
		...badge,
		...breadcrumb,
		...bubble,
		...button,
		...buttonGroup,
		...calendar,
		...card,
		...carousel,
		...chart,
		...checkbox,
		...collapsible,
		...combobox,
		...command,
		...contextMenu,
		...dialog,
		...direction,
		...drawer,
		...dropdownMenu,
		...empty,
		...field,
		...hoverCard,
		...input,
		...inputGroup,
		...inputOtp,
		...item,
		...kbd,
		...label,
		...marker,
		...menubar,
		...message,
		...messageScroller,
		...nativeSelect,
		...navigationMenu,
		...pagination,
		...popover,
		...progress,
		...radioGroup,
		...resizable,
		...scrollArea,
		...select,
		...separator,
		...sheet,
		...sidebar,
		...skeleton,
		...slider,
		...sonner,
		...spinner,
		...switchComponent,
		...table,
		...tabs,
		...textarea,
		...toggle,
		...toggleGroup,
		...tooltip,
	});
}
