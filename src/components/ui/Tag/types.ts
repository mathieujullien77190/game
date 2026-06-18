export type Props = {
  color: string;
  bg: string;
  children: React.ReactNode;
  active?: boolean;
  large?: boolean;
  onClick?: () => void;
};
