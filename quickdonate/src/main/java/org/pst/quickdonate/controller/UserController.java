package org.pst.quickdonate.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.pst.quickdonate.domain.User;

@Path("/user")
public class UserController {

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public User getById(@PathParam("id") String id) {
		return new User(id, "some name from REST controller", 1);
	}
}
