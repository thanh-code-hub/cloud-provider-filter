import math

# Euclidean distance between two points
def distance_between_points(point1: tuple[float, float], point2: tuple[float, float]) -> float:
    try:
        if point1 is None or point2 is None or len(point1) != 2 or len(point2) != 2:
            raise ValueError(f"Coodinates are not valid or none: {point1}, {point2}")
        return math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)
    except Exception as e:
        print(f"Error in distance_between_points: {str(e)}")
        raise e
