package org.pst.quickdonate.controller;

import java.net.URI;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
//import javax.ws.rs.container.AsyncResponse;
//import javax.ws.rs.container.Suspended;

import org.pst.quickdonate.domain.Wish;
import org.pst.quickdonate.service.WishService;
import org.pst.quickdonate.serviceimpl.WishServiceImpl;

@Path("/wish")
public class WishController {
	
	private WishService wishService = new WishServiceImpl();
	
	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Wish get(@PathParam("id") String id) {
		return wishService.get(id);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON) 
	public List<Wish> getWishes() {
		return wishService.getWishes();
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response post(/*@Suspended AsyncResponse asyncResponse,*/ @Context UriInfo uriInfo, Wish wish) {
		wishService.create(wish);
		URI uri = uriInfo.getAbsolutePathBuilder().path(wish.getId()).build();
		return Response.created(uri).build();
	}
	
	@PUT
	@Path("{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public void put(/*@Suspended AsyncResponse asyncResponse,*/ @PathParam("id") String id, Wish wish) {
		wishService.update(id, wish);
	}
	
	@DELETE
	@Path("{id}")
	public void delete(/*@Suspended AsyncResponse asyncResponse,*/ @PathParam("id") String id) {
		wishService.delete(id);
	}
	
	@PUT
	@Path("/fulfill/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public void fulfill(/*@Suspended AsyncResponse asyncResponse */ @PathParam("id") String id, Wish wish) {
		wishService.fulfill(id, wish);
	}
	
}
