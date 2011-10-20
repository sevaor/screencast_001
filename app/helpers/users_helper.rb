module UsersHelper
  def time_ago old_time
    sa = seconds_ago old_time

    if sa < 60 # seconds
      measure = 'second'
      quantity = sa
    elsif sa < 60 * 60 # minutes
      measure = 'minute'
      quantity = sa / 60
    elsif sa < 60 * 60 * 24 # hours
      measure = 'hour'
      quantity = sa / (60 * 60)
    elsif sa < 60 * 60 * 24 * 30 # days
      measure = 'day'
      quantity = sa / (60 * 60 * 24)
    else # months
      measure = 'month'
      quantity = sa / (60 * 60 * 24 * 30)
    end

    measure += 's' if quantity.floor > 1

    "%d %s ago" % [quantity.floor, measure]
  end

  def seconds_ago old_time
    Time.now - old_time
  end  
end
