package org.pst.quickdonate.service;

import java.util.List;

import org.pst.quickdonate.domain.Wish;

public interface WishService {
	Wish get(String id);
	List<Wish> getWishes();
	void create(Wish wish);
	void update(String id, Wish wish);
	void delete(String id);
	void fulfill(String id, Wish wish);
}
