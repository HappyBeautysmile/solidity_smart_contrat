// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Iterable Mapping

You cannot iterate through a mapping.
So here is an example of how to create an iterable mapping.
*/
library IterableMapping {
    // Iterable mapping from address to uint256;
    struct Map {
        address[] keys;
        mapping(address => uint256) values;
        mapping(address => uint256) indexOf;
        mapping(address => bool) inserted;
    }

    function get(Map storage _map, address _key) public view returns (uint256) {
        return _map.values[_key];
    }

    function getKeyAtIndex(Map storage _map, uint256 _index)
        public
        view
        returns (address)
    {
        return _map.keys[_index];
    }

    function size(Map storage _map) public view returns (uint256) {
        return _map.keys.length;
    }

    function set(
        Map storage _map,
        address _key,
        uint256 _val
    ) public {
        if (_map.inserted[_key]) {
            _map.values[_key] = _val;
        } else {
            _map.inserted[_key] = true;
            _map.values[_key] = _val;
            _map.indexOf[_key] = _map.keys.length;
            _map.keys.push(_key);
        }
    }

    function remove(Map storage _map, address _key) public {
        if (!_map.inserted[_key]) {
            return;
        }

        delete _map.inserted[_key];
        delete _map.values[_key];

        uint256 index = _map.indexOf[_key];
        uint256 lastIndex = _map.keys.length - 1;
        address lastKey = _map.keys[lastIndex];

        _map.indexOf[lastKey] = index;
        delete _map.indexOf[_key];

        _map.keys[index] = lastKey;
        _map.keys.pop();
    }
}

contract TestIterableMap {
    using IterableMapping for IterableMapping.Map;

    IterableMapping.Map private map;

    function testIterableMap() public {
        map.set(address(0), 0);
        map.set(address(1), 100);
        map.set(address(2), 200); // insert
        map.set(address(2), 200); // update
        map.set(address(3), 300);

        for (uint256 i = 0; i < map.size(); i++) {
            address key = map.getKeyAtIndex(i);

            assert(map.get(key) == i * 100);
        }

        map.remove(address(1));

        // keys = [address(0), address(3), address(2)]
        assert(map.size() == 3);
        assert(map.getKeyAtIndex(0) == address(0));
        assert(map.getKeyAtIndex(1) == address(3));
        assert(map.getKeyAtIndex(2) == address(2));
    }
}
