package auth

import "gopkg.in/check.v1"

func (s *S) TestParseToken(c *check.C) {
	t, err := ParseToken("type token")
	c.Assert(err, check.IsNil)
	c.Assert(t, check.Equals, "token")
	t, err = ParseToken("token")
	c.Assert(err, check.IsNil)
	c.Assert(t, check.Equals, "token")
	t, err = ParseToken("type ble ble")
	c.Assert(err, check.Equals, ErrInvalidToken)
	c.Assert(t, check.Equals, "")
	t, err = ParseToken("")
	c.Assert(err, check.Equals, ErrInvalidToken)
	c.Assert(t, check.Equals, "")
}
