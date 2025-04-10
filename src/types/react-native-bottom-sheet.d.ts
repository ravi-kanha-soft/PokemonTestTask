declare module 'react-native-bottom-sheet' {
  import {Component, Ref} from 'react';
  import {ViewStyle} from 'react-native';

  interface BottomSheetProps {
    ref?: Ref<BottomSheet>;
    index?: number;
    snapPoints?: string[];
    enablePanDownToClose?: boolean;
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  class BottomSheet extends Component<BottomSheetProps> {
    expand(): void;
    collapse(): void;
    close(): void;
  }

  export default BottomSheet;
}
