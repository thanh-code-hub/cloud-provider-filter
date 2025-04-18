import pytest
from ..utils.sorting import quick_sort_by_distance
from ..utils.distance_calculation import distance_between_points

def test_quick_sort():
    test_list = [
        {
            "geo_latitude": 1,
            "geo_longitude": -2
        },
        {
            "geo_latitude": 3,
            "geo_longitude": 6
        },
        {
            "geo_latitude": 5,
            "geo_longitude": 5
        },
        {
            "geo_latitude": 7,
            "geo_longitude": -8
        },
        {
            "geo_latitude": -2,
            "geo_longitude": 3
        },
        {
            "geo_latitude": -4,
            "geo_longitude": 2
        },
        {
            "geo_latitude": -6,
            "geo_longitude": -3
        }
    ]
    test_target = (-2,6)
    sorted_list = quick_sort_by_distance(test_list, test_target)
    assert sorted_list == [
        {
            "geo_latitude": -2,
            "geo_longitude": 3
        },
        {
            "geo_latitude": -4,
            "geo_longitude": 2
        },
        {
            "geo_latitude": 3,
            "geo_longitude": 6
        },
        {
            "geo_latitude": 5,
            "geo_longitude": 5
        },
        {
            "geo_latitude": 1,
            "geo_longitude": -2
        },
        {
            "geo_latitude": -6, 
            "geo_longitude": -3
        },
        {
            "geo_latitude": 7,
            "geo_longitude": -8
        }   
    ]

def test_quick_sort_raise_error():
    try:
        sorted_list = quick_sort_by_distance([{
            "geo_latitude": 7,
            "geo_longitude": -8
        }  ], ('string',))
        assert False
    except ValueError as e:
        assert True
        assert str(e) == "Coodinates are not valid or none: (7, -8), ('string',)"

def test_distance_between_points():
    point1 = (1, 2)
    point2 = (3, 4)
    distance = distance_between_points(point1, point2)
    assert distance == 2.8284271247461903

def test_distance_between_points_raise_error():
    try:
        point1 = None
        point2 = (3, 4)
        distance = distance_between_points(point1, point2)
        assert False
    except ValueError as e:
        assert True
        assert str(e) == "Coodinates are not valid or none: None, (3, 4)"
