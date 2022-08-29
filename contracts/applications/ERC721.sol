// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC721.sol";

contract ERC721 is IERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed id
    );
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 indexed id
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    // Mapping from token ID to owner address
    mapping(uint256 => address) internal _ownerOf;

    // Mapping owner address to token count
    mapping(address => uint256) internal _balanceOf;

    // Mapping from token ID to approved address
    mapping(uint256 => address) internal _approvals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    function supportsInterface(bytes4 _interfaceId)
        external
        pure
        returns (bool)
    {
        return
            _interfaceId == type(IERC721).interfaceId ||
            _interfaceId == type(IERC165).interfaceId;
    }

    function ownerOf(uint256 _id) external view returns (address owner) {
        owner = _ownerOf[_id];
        require(owner != address(0), "token doesn't exist");
    }

    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0), "owner = zero address");

        return _balanceOf[_owner];
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        isApprovedForAll[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function approve(address _spender, uint256 _id) external {
        address owner = _ownerOf[_id];

        require(
            msg.sender == owner || isApprovedForAll[owner][msg.sender],
            "not authorized"
        );

        _approvals[_id] = _spender;

        emit Approval(owner, _spender, _id);
    }

    function getApproved(uint256 _id) external view returns (address) {
        require(_ownerOf[_id] != address(0), "token doesn't exist");

        return _approvals[_id];
    }

    function _isApprovedOrOwner(
        address _owner,
        address _spender,
        uint256 _id
    ) internal view returns (bool) {
        return (_spender == _owner ||
            isApprovedForAll[_owner][_spender] ||
            _spender == _approvals[_id]);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) public {
        require(_from == _ownerOf[_id], "from != owner");
        require(_to != address(0), "transfer to zero address");
        require(_isApprovedOrOwner(_from, msg.sender, _id), "not authorized");

        _balanceOf[_from]--;
        _balanceOf[_to]++;
        _ownerOf[_id] = _to;

        delete _approvals[_id];

        emit Transfer(_from, _to, _id);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external {
        transferFrom(_from, _to, _id);

        require(
            _to.code.length == 0 ||
                IERC721Receiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _id,
                    ""
                ) ==
                IERC721Receiver.onERC721Received.selector,
            "unsafe recipient"
        );
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        bytes calldata _data
    ) external {
        transferFrom(_from, _to, _id);

        require(
            _to.code.length == 0 ||
                IERC721Receiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _id,
                    _data
                ) ==
                IERC721Receiver.onERC721Received.selector,
            "unsafe recipient"
        );
    }

    function _mint(address _to, uint256 _id) internal {
        require(_to != address(0), "mint to zero address");
        require(_ownerOf[_id] == address(0), "already minted");

        _balanceOf[_to]++;
        _ownerOf[_id] = _to;

        emit Transfer(address(0), _to, _id);
    }

    function _burn(uint256 _id) internal {
        address owner = _ownerOf[_id];
        require(owner != address(0), "not minted");

        _balanceOf[owner] -= 1;

        delete _ownerOf[_id];
        delete _approvals[_id];

        emit Transfer(owner, address(0), _id);
    }
}

contract SampleNFT is ERC721 {
    function mint(address _to, uint256 _id) external {
        _mint(_to, _id);
    }

    function burn(uint256 _id) external {
        require(msg.sender == _ownerOf[_id], "not owner");
        _burn(_id);
    }
}
