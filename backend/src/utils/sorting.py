from .distance_calculation import distance_between_points

# Quick sort implementation
def quick_sort_by_distance(array: list[dict], target: tuple[float, float], lowIndex: int = 0) -> list[dict]:
    try:
        if array is None or len(array) == 0:
            return []

        # Deep clone the array to avoid mutating the original array 
        temp = [item for item in array]

        # Set pivot index to the last index of the array
        pivotIndex = len(temp) - 1

        # Get pivot element
        pivot = temp[pivotIndex]
        
        # Check if pivot has required geo coordinates
        if "geo_latitude" not in pivot or "geo_longitude" not in pivot:
            return []
            
        # Calculate distance from pivot to target only once
        distance_from_pivot = distance_between_points((pivot["geo_latitude"], pivot["geo_longitude"]), target)

        # Initialize index of smaller element
        i = lowIndex - 1

        # Iterate through array and swap elements
        for j in range(lowIndex, pivotIndex):
            if "geo_latitude" not in temp[j] or "geo_longitude" not in temp[j]:
                continue

            # If current element is smaller than or equal to pivot, swap it with the element at index i
            if distance_between_points((temp[j]["geo_latitude"], temp[j]["geo_longitude"]), target) <= distance_from_pivot:
                i += 1
                # Swap elements, move all elements less than pivot to the left, and all elements greater than pivot to the right
                temp[i], temp[j] = temp[j], temp[i]

        # move the pivot to the correct position in the array
        temp[i + 1], temp[pivotIndex] = temp[pivotIndex], temp[i + 1]

        # Recursively sort elements on the left and right of the pivot. Divide and conquer.
        return quick_sort_by_distance(temp[:(i + 1)], target) + [temp[i + 1]] + quick_sort_by_distance(temp[(i + 2):], target)
    except Exception as e:
        print(f"Error in quick_sort_by_distance: {str(e)}")
        raise e