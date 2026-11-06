"use client";

/**
 * Site-wide icon set: Phosphor icons (duotone by default) exposed under the names the
 * app already used, so every page shares one consistent, polished icon style.
 * Size icons with Tailwind classes (w-4 h-4); colour follows the text colour.
 */
import React, { forwardRef } from "react";
import {
  Archive as P_Archive,
  ArrowClockwise as P_ArrowClockwise,
  ArrowCounterClockwise as P_ArrowCounterClockwise,
  ArrowDown as P_ArrowDown,
  ArrowLeft as P_ArrowLeft,
  ArrowRight as P_ArrowRight,
  ArrowSquareOut as P_ArrowSquareOut,
  ArrowUp as P_ArrowUp,
  ArrowsClockwise as P_ArrowsClockwise,
  Bank as P_Bank,
  BookOpenText as P_BookOpenText,
  Briefcase as P_Briefcase,
  BuildingOffice as P_BuildingOffice,
  Buildings as P_Buildings,
  CalendarBlank as P_CalendarBlank,
  CaretDown as P_CaretDown,
  CaretRight as P_CaretRight,
  CaretUp as P_CaretUp,
  ChartBar as P_ChartBar,
  ChartBarHorizontal as P_ChartBarHorizontal,
  ChartPieSlice as P_ChartPieSlice,
  Check as P_Check,
  CheckCircle as P_CheckCircle,
  CheckSquare as P_CheckSquare,
  CircleNotch as P_CircleNotch,
  Clock as P_Clock,
  ClockCounterClockwise as P_ClockCounterClockwise,
  Copy as P_Copy,
  DownloadSimple as P_DownloadSimple,
  Eye as P_Eye,
  EyeSlash as P_EyeSlash,
  FileText as P_FileText,
  Fire as P_Fire,
  Funnel as P_Funnel,
  GearSix as P_GearSix,
  GlobeHemisphereEast as P_GlobeHemisphereEast,
  GraduationCap as P_GraduationCap,
  HardDrives as P_HardDrives,
  Hexagon as P_Hexagon,
  Image as P_Image,
  Info as P_Info,
  List as P_List,
  LockSimple as P_LockSimple,
  MagnifyingGlass as P_MagnifyingGlass,
  MagnifyingGlassMinus as P_MagnifyingGlassMinus,
  MagnifyingGlassPlus as P_MagnifyingGlassPlus,
  MapPin as P_MapPin,
  MapTrifold as P_MapTrifold,
  Medal as P_Medal,
  Minus as P_Minus,
  Palette as P_Palette,
  Pause as P_Pause,
  PencilSimple as P_PencilSimple,
  Play as P_Play,
  Plus as P_Plus,
  Prohibit as P_Prohibit,
  Pulse as P_Pulse,
  Question as P_Question,
  ShareNetwork as P_ShareNetwork,
  Shield as P_Shield,
  ShieldCheck as P_ShieldCheck,
  ShieldWarning as P_ShieldWarning,
  SignOut as P_SignOut,
  SlidersHorizontal as P_SlidersHorizontal,
  Stack as P_Stack,
  Star as P_Star,
  Trash as P_Trash,
  TrendUp as P_TrendUp,
  UploadSimple as P_UploadSimple,
  User as P_User,
  UsersThree as P_UsersThree,
  Warning as P_Warning,
  WarningCircle as P_WarningCircle,
  X as P_X,
  XCircle as P_XCircle,
  type IconProps as PhosphorProps,
  type IconWeight,
} from "@phosphor-icons/react";

export interface IconProps extends Omit<PhosphorProps, "weight"> {
  weight?: IconWeight;
  /** accepted for compatibility with the previous icon set; ignored */
  strokeWidth?: number | string;
}

function make(Icon: React.ComponentType<PhosphorProps>, name: string, defaultWeight: IconWeight) {
  const C = forwardRef<SVGSVGElement, IconProps>(function AppIcon({ weight, strokeWidth: _sw, size = 24, ...rest }, ref) {
    return <Icon ref={ref} weight={weight ?? defaultWeight} size={size} aria-hidden={rest["aria-label"] ? undefined : true} {...rest} />;
  });
  C.displayName = name;
  return C;
}

export const Activity = make(P_Pulse, "Activity", "duotone");
export const AlertCircle = make(P_WarningCircle, "AlertCircle", "duotone");
export const AlertTriangle = make(P_Warning, "AlertTriangle", "duotone");
export const Archive = make(P_Archive, "Archive", "duotone");
export const ArrowDown = make(P_ArrowDown, "ArrowDown", "regular");
export const ArrowLeft = make(P_ArrowLeft, "ArrowLeft", "regular");
export const ArrowRight = make(P_ArrowRight, "ArrowRight", "regular");
export const ArrowUp = make(P_ArrowUp, "ArrowUp", "regular");
export const Award = make(P_Medal, "Award", "duotone");
export const Ban = make(P_Prohibit, "Ban", "duotone");
export const BarChart2 = make(P_ChartBar, "BarChart2", "duotone");
export const BarChart3 = make(P_ChartBarHorizontal, "BarChart3", "duotone");
export const BookOpen = make(P_BookOpenText, "BookOpen", "duotone");
export const Briefcase = make(P_Briefcase, "Briefcase", "duotone");
export const Building = make(P_Buildings, "Building", "duotone");
export const Building2 = make(P_BuildingOffice, "Building2", "duotone");
export const Calendar = make(P_CalendarBlank, "Calendar", "duotone");
export const Check = make(P_Check, "Check", "regular");
export const CheckCircle = make(P_CheckCircle, "CheckCircle", "duotone");
export const CheckCircle2 = make(P_CheckCircle, "CheckCircle2", "duotone");
export const ChevronDown = make(P_CaretDown, "ChevronDown", "regular");
export const ChevronRight = make(P_CaretRight, "ChevronRight", "regular");
export const ChevronUp = make(P_CaretUp, "ChevronUp", "regular");
export const Clock = make(P_Clock, "Clock", "duotone");
export const Copy = make(P_Copy, "Copy", "duotone");
export const Download = make(P_DownloadSimple, "Download", "duotone");
export const Edit2 = make(P_PencilSimple, "Edit2", "duotone");
export const ExternalLink = make(P_ArrowSquareOut, "ExternalLink", "regular");
export const Eye = make(P_Eye, "Eye", "duotone");
export const EyeOff = make(P_EyeSlash, "EyeOff", "duotone");
export const FileCheck = make(P_FileText, "FileCheck", "duotone");
export const FileText = make(P_FileText, "FileText", "duotone");
export const Filter = make(P_Funnel, "Filter", "duotone");
export const Flame = make(P_Fire, "Flame", "duotone");
export const Globe = make(P_GlobeHemisphereEast, "Globe", "duotone");
export const GraduationCap = make(P_GraduationCap, "GraduationCap", "duotone");
export const HelpCircle = make(P_Question, "HelpCircle", "duotone");
export const Hexagon = make(P_Hexagon, "Hexagon", "duotone");
export const History = make(P_ClockCounterClockwise, "History", "duotone");
export const Image = make(P_Image, "Image", "duotone");
export const Info = make(P_Info, "Info", "duotone");
export const Landmark = make(P_Bank, "Landmark", "duotone");
export const Layers = make(P_Stack, "Layers", "duotone");
export const Loader2 = make(P_CircleNotch, "Loader2", "regular");
export const Lock = make(P_LockSimple, "Lock", "duotone");
export const LogOut = make(P_SignOut, "LogOut", "duotone");
export const Map = make(P_MapTrifold, "Map", "duotone");
export const MapPin = make(P_MapPin, "MapPin", "duotone");
export const Menu = make(P_List, "Menu", "regular");
export const Minus = make(P_Minus, "Minus", "regular");
export const Palette = make(P_Palette, "Palette", "duotone");
export const Pause = make(P_Pause, "Pause", "duotone");
export const PieChart = make(P_ChartPieSlice, "PieChart", "duotone");
export const Play = make(P_Play, "Play", "duotone");
export const Plus = make(P_Plus, "Plus", "regular");
export const RefreshCw = make(P_ArrowsClockwise, "RefreshCw", "regular");
export const RotateCcw = make(P_ArrowCounterClockwise, "RotateCcw", "regular");
export const RotateCw = make(P_ArrowClockwise, "RotateCw", "regular");
export const Search = make(P_MagnifyingGlass, "Search", "duotone");
export const Server = make(P_HardDrives, "Server", "duotone");
export const Settings = make(P_GearSix, "Settings", "duotone");
export const Share2 = make(P_ShareNetwork, "Share2", "duotone");
export const Shield = make(P_Shield, "Shield", "duotone");
export const ShieldAlert = make(P_ShieldWarning, "ShieldAlert", "duotone");
export const ShieldCheck = make(P_ShieldCheck, "ShieldCheck", "duotone");
export const Sliders = make(P_SlidersHorizontal, "Sliders", "duotone");
export const Star = make(P_Star, "Star", "duotone");
export const Trash2 = make(P_Trash, "Trash2", "duotone");
export const TrendingUp = make(P_TrendUp, "TrendingUp", "duotone");
export const Upload = make(P_UploadSimple, "Upload", "duotone");
export const User = make(P_User, "User", "duotone");
export const Users = make(P_UsersThree, "Users", "duotone");
export const Vote = make(P_CheckSquare, "Vote", "duotone");
export const X = make(P_X, "X", "regular");
export const XCircle = make(P_XCircle, "XCircle", "duotone");
export const ZoomIn = make(P_MagnifyingGlassPlus, "ZoomIn", "duotone");
export const ZoomOut = make(P_MagnifyingGlassMinus, "ZoomOut", "duotone");
