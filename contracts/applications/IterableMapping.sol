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
