package edu.cit.bituindestinations.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.cit.bituindestinations.Entity.UserEntity;
 
 
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{
}