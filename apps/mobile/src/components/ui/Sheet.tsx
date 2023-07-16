import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import type { FC, PropsWithChildren } from 'react'
import React, { useCallback, useMemo, useRef } from 'react'

import { theme } from '~/helpers/theme'

type Props = {
  sheetRef?: React.RefObject<BottomSheetModalMethods>
  snap?: string[]
  marginX?: number
}

const Sheet: FC<PropsWithChildren & Props> = ({
  snap,
  marginX,
  children,
  sheetRef
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => snap ?? ['40%'], [snap])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.9}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      index={0}
      ref={sheetRef ?? bottomSheetModalRef}
      backgroundStyle={{
        borderRadius: 40,
        backgroundColor: theme.colors.backdrop
      }}
      style={{ marginHorizontal: marginX ?? 10 }}
      bottomInset={20}
      detached={true}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      {children}
    </BottomSheetModal>
  )
}

export default Sheet
