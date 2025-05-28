import {
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react"

const CardSkeleton = () => {
    return (
        <>
            <Stack gap="6" >
                <HStack width="full">
                    <SkeletonCircle size="10" />
                    <SkeletonText noOfLines={2} />
                </HStack>
                <Skeleton height="200px" />
            </Stack>

        </>
    );
}

export default CardSkeleton;
