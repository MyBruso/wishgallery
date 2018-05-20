package org.pst.quickdonate.serviceimpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.pst.quickdonate.domain.Account;
import org.pst.quickdonate.domain.Wish;
import org.pst.quickdonate.service.WishService;

public class WishServiceImpl implements WishService {

	private static Map<String, Wish> wishesById = new HashMap<>();
	
	public WishServiceImpl() {
//		Wish wish = new Wish("wish1", "Send Parle G!", "brusoAadharId", new Account("bruso@axis.com"), 1000, true);
//		wishesById.put("wish1", wish);
//		wish = new Wish("wish2", "Be quick in sending cheez blocks!!!", "brunoAadharId", new Account("bruno@axis.com"), 2000, true);
//		wishesById.put("wish2", wish);
	}
	
	@Override
	public Wish get(String id) {
		Wish existingWish = wishesById.get(id);
		return existingWish;
	}

	@Override
	public List<Wish> getWishes() {
		return new ArrayList<>(wishesById.values());
	}

	@Override
	public void create(Wish wish) {
		String uniqueWishId = String.valueOf(wishesById.keySet().size() + 1);
		wish.setId(uniqueWishId);
		wishesById.put(uniqueWishId, wish);
	}

	@Override
	public void update(String id, Wish wish) {
		Wish existingWish = wishesById.get(id);
		if (existingWish != null) {
			wishesById.put(existingWish.getId(), wish);
		}
	}

	@Override
	public void delete(String id) {
		Wish existingWish = wishesById.get(id);
		if (existingWish != null) {
			existingWish.setIsActive(false);
			wishesById.put(existingWish.getId(), existingWish);
		}
	}
	
	@Override
	public void fulfill(String id, Wish wish) {
		Wish existingWish = wishesById.get(id);
		if (existingWish != null) {
			existingWish.setIsFulfilled(true);
			wishesById.put(existingWish.getId(), existingWish);
		}
	}

}
